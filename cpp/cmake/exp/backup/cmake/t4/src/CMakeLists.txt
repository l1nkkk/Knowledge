INCLUDE_DIRECTORIES(/home/l1nkkk/Documents/github/Knowledge/cpp/cmake/exp/backup/cmake/t3/lib)

LINK_DIRECTORIES(/home/l1nkkk/tmp/lib)

ADD_EXECUTABLE(main main.c)
TARGET_LINK_LIBRARIES(main libhello_static.a)

