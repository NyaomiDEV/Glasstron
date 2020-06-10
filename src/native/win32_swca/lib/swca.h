#include <dwmapi.h>

#include <iostream>

struct ACCENTPOLICY {
    int nAccentState;
    int nFlags;
    int nColor;
    int nAnimationId;
};

struct WINCOMATTRPDATA {
    int nAttribute;
    PVOID pData;
    ULONG ulDataSize;
};

typedef BOOL(WINAPI* pSetWindowCompositionAttribute)(HWND, WINCOMATTRPDATA*);

int swca(HWND hwnd, int accentState, int color);