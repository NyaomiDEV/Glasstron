/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
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

/*
enum ACCENTTYPES{
	ACCENT_DISABLE = 0,
	ACCENT_ENABLE_GRADIENT = 1,
	ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
	ACCENT_ENABLE_BLURBEHIND = 3,
	ACCENT_ENABLE_ACRYLICBLURBEHIND = 4,
	ACCENT_INVALID_STATE = 5
};
*/

typedef BOOL(WINAPI *pSetWindowCompositionAttribute)(HWND, WINCOMATTRPDATA *);

int swca(HWND hwnd, int accentState, int color);
