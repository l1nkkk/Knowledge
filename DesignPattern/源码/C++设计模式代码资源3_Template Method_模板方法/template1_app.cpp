//Ӧ�ó��򿪷���Ա
class Application{
public:
// Ӧ�ÿ�����Ա��д�Ĳ���
	bool Step2(){
		//...
    }

    void Step4(){
		//...
    }
};

int main()
{
	// ��������ṹ
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
