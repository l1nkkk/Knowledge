// 伪码，假设有一个Form父类
class MainForm : public Form {
private:
	Point p1;
	Point p2;

	// 线
	vector<Line> lineVector;
	// 矩形
	vector<Rect> rectVector;
	//改变
	vector<Circle> circleVector;

public:
	MainForm(){
		//...
	}
protected:
	
	virtual void OnMouseDown(const MouseEventArgs& e);
	virtual void OnMouseUp(const MouseEventArgs& e);
	// 界面被刷新的时候
	virtual void OnPaint(const PaintEventArgs& e);
};


void MainForm::OnMouseDown(const MouseEventArgs& e){
	// 当鼠标点下的时候取第一个点
	p1.x = e.X;
	p1.y = e.Y;

	//...
	Form::OnMouseDown(e);
}

void MainForm::OnMouseUp(const MouseEventArgs& e){
	// 抬起时取第二个点
	p2.x = e.X;
	p2.y = e.Y;

	// 如果目前用户是选择画线，一个radiobutton
	if (rdoLine.Checked){
		Line line(p1, p2);
		lineVector.push_back(line);
	}
	else if (rdoRect.Checked){
		int width = abs(p2.x - p1.x);
		int height = abs(p2.y - p1.y);
		Rect rect(p1, width, height);
		rectVector.push_back(rect);
	}
	//改变
	else if (...){
		//...
		circleVector.push_back(circle);
	}

	//...
	// Refresh系统会调用OnPaint
	this->Refresh();

	Form::OnMouseUp(e);
}

void MainForm::OnPaint(const PaintEventArgs& e){
	// 业务逻辑的主要部分
	//针对直线
	for (int i = 0; i < lineVector.size(); i++){
		// 取起始点和终止点调用画线函数
		e.Graphics.DrawLine(Pens.Red,
			lineVector[i].start.x, 
			lineVector[i].start.y,
			lineVector[i].end.x,
			lineVector[i].end.y);
	}

	//针对矩形
	for (int i = 0; i < rectVector.size(); i++){
		e.Graphics.DrawRectangle(Pens.Red,
			rectVector[i].leftUp,
			rectVector[i].width,
			rectVector[i].height);
	}

	//改变
	//针对圆形
	for (int i = 0; i < circleVector.size(); i++){
		e.Graphics.DrawCircle(Pens.Red,
			circleVector[i]);
	}

	//...
	Form::OnPaint(e);
}

