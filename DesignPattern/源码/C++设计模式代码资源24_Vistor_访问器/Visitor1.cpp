#include <iostream>
using namespace std;

class Visitor;


class Element
{
public:
    virtual void accept(Visitor& visitor) = 0; //第一次多态辨析

    virtual ~Element(){}
};

class ElementA : public Element
{
public:
    void accept(Visitor &visitor) override {
        visitor.visitElementA(*this);
    }
    

};

class ElementB : public Element
{
public:
    void accept(Visitor &visitor) override {
        visitor.visitElementB(*this); //第二次多态辨析
    }

};


class Visitor{
public:
    virtual void visitElementA(ElementA& element) = 0;
    virtual void visitElementB(ElementB& element) = 0;
    
    virtual ~Visitor(){}
};
// 之上是我预先设计的,不会改变的
//==================================
// 之下是我将来可能要添加的

//扩展1
class Visitor1 : public Visitor{
public:
    void visitElementA(ElementA& element) override{
        cout << "Visitor1 is processing ElementA" << endl;
    }
        
    void visitElementB(ElementB& element) override{
        cout << "Visitor1 is processing ElementB" << endl;
    }
};
     
//扩展2，其他需求
class Visitor2 : public Visitor{
public:
    void visitElementA(ElementA& element) override{
        cout << "Visitor2 is processing ElementA" << endl;
    }
    
    void visitElementB(ElementB& element) override{
        cout << "Visitor2 is processing ElementB" << endl;
    }
};
        
    

        
int main()
{
    Visitor2 visitor;
    Element *element;
    *element = ElementB();
    // 给elementB添加visitor2操作
    element->accept(visitor);// double dispatch 二次多态辨析
    
    // 给elementA添加visitor2操作
    // 先找ElementA的accept，一次动态辨析
    // 再找visitor2找到visitElementA
    *element = ElementA();
    element->accept(visitor);

    
    return 0;
}