# Generic C/C++ makefile for Linux & OSX & Windows 
#  Last update:  2018/10/13 
#
#
ifeq "${OS}" "Windows_NT"
 detected_OS :="Windows_NT"
 TARGET:=prog.exe
 CLEAN:=del *.obj prog.exe 
 RUNTARGET:=prog.exe 
else 
detected_OS := $(shell uname -s)
 TARGET:=prog 
 CLEAN:=rm -f *.o prog 
 RUNTARGET:=./prog 
 
endif 


SOURCES1:=$(wildcard *.c)
SOURCES2:=$(wildcard *.cpp) 
OBJS1:=$(subst .c,.o,$(SOURCES1)) 
OBJS2:=$(subst .cpp,.o,$(SOURCES2)) 
OBJS_UNIX:=$(OBJS1) $(OBJS2) 
OBJS3:=$(subst .c,.obj,$(SOURCES1)) 
OBJS4:=$(subst .cpp,.obj,$(SOURCES2))
OBJS_WIN:=$(OBJS3) $(OBJS4) 


# OS X
ifeq "$(detected_OS)" "Darwin"
     LDFLAGS =  -framework OpenGL -framework GLUT  
	     
endif 


# Linux 
ifeq "$(detected_OS)" "Linux"
	LDFLAGS = -lGL -lGLU -lglut -lm 
endif 


.SUFFIXES: .c .o .cpp  .obj 

.c.o: 
	gcc -c -Wall -Wno-deprecated  $< 

.cpp.o: 
	g++ -c -Wall -Wno-deprecated  $< 

.cpp.obj: 
	cl /c /W4  /wd4255 /wd4100 $< /I C:\GLUT

.c.obj: 
	cl /c /W4  /wd4255 /wd4100 $< /I C:\GLUT	
	
	
all:$(TARGET)



prog: $(OBJS_UNIX)
	g++ -o  prog -Wall $(OBJS_UNIX) $(LDFLAGS)

	
prog.exe: $(OBJS_WIN) 	
		@echo $(OBJS_WIN)
		LINK  /WX $(OBJS_WIN) /LIBPATH:C:\GLUT  /OUT:prog.exe
		
clean: 
	$(CLEAN) 


run:  all   
	$(RUNTARGET)  


