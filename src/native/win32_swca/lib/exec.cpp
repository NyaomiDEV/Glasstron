#include "swca.cpp"

int main(int argc, char** argv) {
    if (argc < 4) return 2;

    return swca((HWND)std::stoull(argv[1]), std::atoi(argv[2]),
                std::atoi(argv[3]));
}