enum TaxBase {
	CN_Tax, // �й�
	US_Tax, // ����
	DE_Tax, // �¹�
	FR_Tax       //����
};

class SalesOrder{
    TaxBase tax;
public:
    double CalculateTax(){
        //...
        
        if (tax == CN_Tax){
            //CN***********
        }
        else if (tax == US_Tax){
            //US***********
        }
        else if (tax == DE_Tax){
            //DE***********
        }
		else if (tax == FR_Tax){  //����
			//...
		}

        //....
     }
    
};
