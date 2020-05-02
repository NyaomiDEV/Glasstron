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

struct ACCENTPOLICY{
	int nAccentState;
	int nFlags;
	int nColor;
	int nAnimationId;
};

struct WINCOMATTRPDATA{
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

// https://stackoverflow.com/a/52122386
double getSysOpType(){
	int ret = 0.0;
	NTSTATUS(WINAPI *RtlGetVersion)(LPOSVERSIONINFOEXW);
	OSVERSIONINFOEXW osInfo;

	*(FARPROC*)&RtlGetVersion = GetProcAddress(GetModuleHandleA("ntdll"), "RtlGetVersion");

	if(NULL != RtlGetVersion){
		osInfo.dwOSVersionInfoSize = sizeof(osInfo);
		RtlGetVersion(&osInfo);
		ret = osInfo.dwMajorVersion;
	}
	return ret;
}

int main(int argc, char** argv) {
	if(argc < 4) return 2;
	
	if(getSysOpType() < 10.0){
		if(strcmp(argv[2], (char*)"4") == 0) argv[2] = (char*)"3";
	}

	HWND hwnd = (HWND) std::stoull(argv[1]);

	const HINSTANCE hModule = LoadLibrary(TEXT("user32.dll"));
	typedef BOOL(WINAPI* pSetWindowCompositionAttribute) (HWND, WINCOMATTRPDATA*);
	const pSetWindowCompositionAttribute SetWindowCompositionAttribute = (pSetWindowCompositionAttribute) GetProcAddress(hModule, "SetWindowCompositionAttribute");
	if (SetWindowCompositionAttribute){

		ACCENTPOLICY policy;
		policy.nAccentState = std::atoi(argv[2]);
		policy.nFlags = 2;
		policy.nColor = std::atoi(argv[3]);

		WINCOMATTRPDATA data;
		data.nAttribute = 19; // WCA_ACCENT_POLICY
		data.ulDataSize = sizeof(policy);
		data.pData = &policy;

		SetWindowCompositionAttribute(hwnd, &data);
		FreeLibrary(hModule);
		return 0;
	}

	return 1;
}
