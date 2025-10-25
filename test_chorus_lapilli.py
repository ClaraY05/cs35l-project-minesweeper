#!/usr/bin/env python3
import unittest
import os
import sys
import argparse
import subprocess
import unittest
import urllib.request


class TestChorusLapilli(unittest.TestCase):
    '''Integration testing for Chorus Lapilli

    This class handles the entire react start up, testing, and take down
    process. Feel free to modify it to suit your needs.
    '''

    # ========================== [USEFUL CONSTANTS] ===========================

    # Vite default startup address
    VITE_HOST_ADDR = 'http://localhost:5173'

    # XPATH query used to find Chorus Lapilli board tiles
    BOARD_TILE_XPATH = '//button[contains(@class, \'square\')]'

    # Sets of symbol classes - each string contains all valid characters
    # for that particular symbol
    SYMBOL_BLANK = ''
    SYMBOL_X = 'Xx'
    SYMBOL_O = '0Oo'

    # ======================== [SETUP/TEARDOWN HOOKS] =========================

    @classmethod
    def setUpClass(cls):
        '''This function runs before testing occurs.

        Bring up the web app and configure Selenium
        '''

        env = dict(os.environ)
        env.update({
            # Prevent React from starting its own browser window
            'BROWSER': 'none',
        })

        subprocess.run(['npm', 'install'],
                           stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL,
                           env=env,
                           check=True)

        # Await Webserver Start
        cls.vite = subprocess.Popen(
            ['npm', 'run', 'dev'],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            env=env)

        if cls.vite.stdout is None:
            raise OSError("Vite failed to start")
        for _ in cls.vite.stdout:
            try:
                with urllib.request.urlopen(cls.VITE_HOST_ADDR):
                    break

            except IOError:
                pass

            # Ensure Vite does not terminate early
            if cls.vite.poll() is not None:
                raise OSError('Vite terminated before test')
        if cls.vite.poll() is not None:
            raise OSError('Vite terminated before test')

        cls.driver = Browser()
        cls.driver.get(cls.VITE_HOST_ADDR)
        cls.driver.implicitly_wait(0.5)

    @classmethod
    def tearDownClass(cls):
        '''This function runs after all testing have run.

        Terminate Vite and take down the Selenium webdriver.
        '''
        cls.vite.terminate()
        cls.vite.wait()
        cls.driver.quit()

    def setUp(self):
        '''This function runs before every test.

        Refresh the browser so we get a new board.
        '''
        self.driver.refresh()

    def tearDown(self):
        '''This function runs after every test.

        Not needed, but feel free to add stuff here.
        '''

    # ========================== [HELPER FUNCTIONS] ===========================

    def assertBoardEmpty(self, tiles):
        '''Checks if all board tiles are empty.

        Arguments:
          tiles: List[WebElement] - a board consisting of 9 buttons elements
        '''
        if len(tiles) != 9:
            raise AssertionError('tiles is not a 3x3 grid')
        for i, tile in enumerate(tiles):
            if tile.text.strip():
                raise AssertionError(f'tile {i} is not empty: '
                                     f'\'{tile.text}\'')

    def assertTileIs(self, tile, symbol_set):
        '''Checks if a certain tile has a certain symbol.

        Arguments:
          tile: WebElement - the button element to check
          symbol_set: str - a string containing all the valid symbols
        Raises:
          AssertionError - if tile is not in the symbol set
        '''
        if symbol_set is None:
            return
        if symbol_set == self.SYMBOL_BLANK:
            name = 'BLANK'
        elif symbol_set == self.SYMBOL_X:
            name = 'X'
        elif symbol_set == self.SYMBOL_O:
            name = 'O'
        else:
            name = 'in symbol_set'
        text = tile.text.strip()
        if ((symbol_set == self.SYMBOL_BLANK and text)
                or (symbol_set != self.SYMBOL_BLANK and not text)
                or text not in symbol_set):
            raise AssertionError(f'tile is not {name}: \'{tile.text}\'')


# =========================== [ADD YOUR TESTS HERE] ===========================

    def test_new_board_empty(self):
        '''Check if a new game always starts with an empty board.'''
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        self.assertBoardEmpty(tiles)

    def test_button_click(self):
        '''Check if clicking the top-left button adds an X.'''
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        self.assertTileIs(tiles[0], self.SYMBOL_BLANK)
        tiles[0].click()
        self.assertTileIs(tiles[0], self.SYMBOL_X)

    def test_no_moves_after_winner(self):
        """After a win, further clicks should not place additional marks."""
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)

        # Play: X 0, O 3, X 1, O 4, X 2  -> X wins across top row
        tiles[0].click()
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[3].click()
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[1].click()
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[4].click()
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[2].click()

        # Attempt to play another move after win (should do nothing)
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[5].click()

        # Tile 5 should remain blank
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        self.assertTileIs(tiles[5], self.SYMBOL_BLANK)

    def test_invalid_non_adjacent_move_resets(self):
        """
        After both players reach 3 pieces (movement phase),
        selecting your piece and then clicking a NON-adjacent empty tile
        should be rejected (board unchanged and selection cleared).
        """
        # Reach movement phase with this placement sequence:
        # X:0, O:3, X:1, O:4, X:8, O:5
        seq = [0, 3, 1, 4, 8, 5]
        for idx in seq:
            tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
            tiles[idx].click()

        # X moves: select X at 8, then try to move to 2 (empty but NON-adjacent to 8)
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        tiles[8].click()
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[2].click()

        # Assert: 8 still X (no move made), 2 still blank
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        self.assertTileIs(tiles[8], self.SYMBOL_X)
        self.assertTileIs(tiles[2], self.SYMBOL_BLANK)

    def test_center_rule_must_win_or_vacate(self):
        """
        If current player has 3 pieces AND occupies center (index 4),
        their move must either win or vacate the center. A move that does neither
        should be rejected.
        """
        # Set up board so X has three including center; O also has three
        # Sequence: X:4, O:0, X:1, O:2, X:7, O:6
        seq = [4, 0, 1, 2, 7, 6]
        for idx in seq:
            tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
            tiles[idx].click()

        # X to move, owns center (4). Try moving X from 7 -> 8 (adjacent),
        # which neither wins nor vacates center. Should be rejected.
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        tiles[7].click()  # select X at 7
        self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)[8].click()  # attempt move to 8

        # Assert: 7 still X, 8 still blank (move rejected)
        tiles = self.driver.find_elements(By.XPATH, self.BOARD_TILE_XPATH)
        self.assertTileIs(tiles[7], self.SYMBOL_X)
        self.assertTileIs(tiles[8], self.SYMBOL_BLANK)


# ================= [DO NOT MAKE ANY CHANGES BELOW THIS LINE] =================

if __name__ != '__main__':
    from selenium.webdriver import Firefox as Browser
    from selenium.webdriver.common.by import By
else:
    parser = argparse.ArgumentParser(prog=sys.argv[0],
                                     description='Chorus Lapilli Tester')
    parser.add_argument('-b',
                        '--browser',
                        action='store',
                        metavar='name',
                        choices=['firefox', 'chrome', 'safari'],
                        default='firefox',
                        help='the browser to run tests with')
    parser.add_argument('-c',
                        '--change-dir',
                        action='store',
                        metavar='dir',
                        default=None,
                        help=('change the working directory before running '
                              'tests'))

    # Change the working directory
    options = parser.parse_args(sys.argv[1:])
    # Import different browser drivers based on user selection
    try:
        if options.browser == 'firefox':
            from selenium.webdriver import Firefox as Browser
        elif options.browser == 'chrome':
            from selenium.webdriver import Chrome as Browser
        else:
            from selenium.webdriver import Safari as Browser
        from selenium.webdriver.common.by import By
    except ImportError as err:
        print('[Error]',
              err, '\n\n'
              'Please refer to the Selenium documentation on installing the '
              'webdriver:\n'
              'https://www.selenium.dev/documentation/webdriver/'
              'getting_started/',
              file=sys.stderr)
        sys.exit(1)

    if options.change_dir:
        try:
            os.chdir(options.change_dir)
        except OSError as err:
            print(err, file=sys.stderr)
            sys.exit(1)

    if not os.path.isfile('package.json'):
        print('Invalid directory: cannot find \'package.json\'',
              file=sys.stderr)
        sys.exit(1)

    tests = unittest.defaultTestLoader.loadTestsFromTestCase(TestChorusLapilli)
    unittest.TextTestRunner().run(tests)
