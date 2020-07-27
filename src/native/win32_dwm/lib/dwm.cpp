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
#include "dwm.h"

int swca(HWND hwnd, int accentState, int color) {
	const HINSTANCE hModule = LoadLibrary(TEXT("user32.dll"));
	const pSetWindowCompositionAttribute SetWindowCompositionAttribute =
		(pSetWindowCompositionAttribute) GetProcAddress(hModule, "SetWindowCompositionAttribute");

	if (SetWindowCompositionAttribute) {
		ACCENTPOLICY policy;
		policy.nAccentState = accentState;
		policy.nFlags = 2;
		policy.nColor = color;
		policy.nAnimationId = 0;

		WINCOMATTRPDATA data;
		data.nAttribute = 19; // WCA_ACCENT_POLICY
		data.pData = &policy;
		data.ulDataSize = sizeof(policy);

		SetWindowCompositionAttribute(hwnd, &data);
		FreeLibrary(hModule);

		return 0;
	}

	return 1;
}
