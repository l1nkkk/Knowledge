PROJECT(HELLO)

SET(CMAKE_INSTALL_PREFIX /home/l1nkkk/tmp)
ADD_SUBDIRECTORY(src bin)
ADD_EXECUTABLE(hellobin src/main.c)

INSTALL(FILES COPYRIGHT README DESTINATION share/doc/cmake/t2)
INSTALL(TARGETS hellobin DESTINATION bin) 
INSTALL(PROGRAMS runhello.sh DESTINATION bin)
INSTALL(DIRECTORY doc/ DESTINATION share/doc/cmake/t2)
