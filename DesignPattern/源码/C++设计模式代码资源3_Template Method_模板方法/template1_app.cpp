//应用程序开发人员
class Application{
public:
// 应用开发人员编写的步骤
	bool Step2(){
		//...
    }

    void Step4(){
		//...
    }
};

int main()
{
	// 整体操作结构
	Library lib();
	Application app();

	lib.Step1();

	if (app.Step2()){
		lib.Step3();
	}

	for (int i = 0; i < 4; i++){
		app.Step4();
	}

	lib.Step5();

}
