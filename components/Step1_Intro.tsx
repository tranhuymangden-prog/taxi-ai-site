
import React from 'react';

interface Step1IntroProps {
  onNext: () => void;
}

const Step1Intro: React.FC<Step1IntroProps> = ({ onNext }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Chào mừng bạn đến với Trình tạo trang web Taxi AI!</h1>
      <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
        Tuyệt vời khi bạn đã có Google Business. Bây giờ, chúng ta sẽ cùng nhau xây dựng một trang web chuyên nghiệp để thu hút nhiều khách hàng hơn nữa.
      </p>
      <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
        Tôi sẽ hỏi bạn một vài câu hỏi về dịch vụ của bạn. Dựa vào câu trả lời, AI sẽ giúp tạo ra nội dung và thiết kế cho trang web của bạn.
      </p>
      <button
        onClick={onNext}
        className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg transform hover:scale-105"
      >
        Bắt đầu nào!
      </button>
    </div>
  );
};

export default Step1Intro;
