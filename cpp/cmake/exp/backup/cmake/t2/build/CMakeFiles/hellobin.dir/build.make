# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.16

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build

# Include any dependencies generated for this target.
include CMakeFiles/hellobin.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/hellobin.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/hellobin.dir/flags.make

CMakeFiles/hellobin.dir/src/main.o: CMakeFiles/hellobin.dir/flags.make
CMakeFiles/hellobin.dir/src/main.o: ../src/main.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object CMakeFiles/hellobin.dir/src/main.o"
	/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/hellobin.dir/src/main.o   -c /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/src/main.c

CMakeFiles/hellobin.dir/src/main.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/hellobin.dir/src/main.i"
	/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/src/main.c > CMakeFiles/hellobin.dir/src/main.i

CMakeFiles/hellobin.dir/src/main.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/hellobin.dir/src/main.s"
	/usr/bin/cc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/src/main.c -o CMakeFiles/hellobin.dir/src/main.s

# Object files for target hellobin
hellobin_OBJECTS = \
"CMakeFiles/hellobin.dir/src/main.o"

# External object files for target hellobin
hellobin_EXTERNAL_OBJECTS =

hellobin: CMakeFiles/hellobin.dir/src/main.o
hellobin: CMakeFiles/hellobin.dir/build.make
hellobin: CMakeFiles/hellobin.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking C executable hellobin"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/hellobin.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/hellobin.dir/build: hellobin

.PHONY : CMakeFiles/hellobin.dir/build

CMakeFiles/hellobin.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/hellobin.dir/cmake_clean.cmake
.PHONY : CMakeFiles/hellobin.dir/clean

CMakeFiles/hellobin.dir/depend:
	cd /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2 /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2 /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build /home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t2/build/CMakeFiles/hellobin.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/hellobin.dir/depend

