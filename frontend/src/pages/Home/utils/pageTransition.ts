export const pageTitles: { [key: string]: string } = {
    "/play": "PLAY ;)",
    "/tutorial": "TUTORIAL :D",
    "/settings": "SETTINGS :P",
    "/leaderboard": "LEADERBOARD :3"
};

export const createOverlay = (rect: DOMRect, bgColor: string): HTMLDivElement => {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.backgroundColor = bgColor;
    overlay.style.zIndex = '9999';
    overlay.style.transition = 'all 0.8s ease-in-out';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.overflow = 'hidden';
    return overlay;
};

export const createTitle = (title: string): HTMLDivElement => {
    const titleText = document.createElement('div');
    titleText.className = 'page-transition-title';
    titleText.textContent = title;
    titleText.style.fontFamily = '"Pixelify Sans", sans-serif';
    titleText.style.fontSize = '4rem';
    titleText.style.color = 'white';
    titleText.style.opacity = '0';
    titleText.style.transition = 'opacity 0.3s ease-in-out';
    titleText.style.textTransform = 'uppercase';
    titleText.style.whiteSpace = 'nowrap';
    return titleText;
};

export const expandOverlay = (overlay: HTMLDivElement, titleText: HTMLDivElement): void => {
    void overlay.offsetWidth; // Force reflow
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    
    setTimeout(() => {
        titleText.style.opacity = '1';
    }, 200);
};

export const shrinkOverlay = (
    overlay: HTMLDivElement, 
    titleText: HTMLDivElement, 
    path: string,
    navigate: (path: string) => void,
    onComplete?: () => void
): void => {
    titleText.style.opacity = '0';
    
    setTimeout(() => {
        navigate(path);
        overlay.style.transition = 'height 0.6s ease-in-out, top 0.6s ease-in-out';
        overlay.style.top = '100vh';
        overlay.style.height = '0';
        
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            onComplete?.();
        }, 600);
    }, 200);
};

export const createPageTransition = (
    element: HTMLElement,
    path: string,
    navigate: (path: string) => void,
    onComplete?: () => void
): void => {
    const rect = element.getBoundingClientRect();
    const bgColor = window.getComputedStyle(element).backgroundColor;
    const pageTitle = pageTitles[path] || "LOADING";

    const overlay = createOverlay(rect, bgColor);
    const titleText = createTitle(pageTitle);
    overlay.appendChild(titleText);
    document.body.appendChild(overlay);

    expandOverlay(overlay, titleText);

    setTimeout(() => {
        shrinkOverlay(overlay, titleText, path, navigate, onComplete);
    }, 800);
};

