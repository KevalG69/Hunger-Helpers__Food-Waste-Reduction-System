import React, { useState } from 'react';
import '../../css/Pages/AboutUs.css';
import Footer from '../../components/ContainerComponents/Footer';

const faqData = [
    {
        question: "What is Hunger Helpers?",
        answer: "Hunger Helpers is a food donation platform that connects donors, NGOs, and volunteers to reduce food waste and fight hunger."
    },
    {
        question: "What We Do?",
        answer: "We collect surplus food and deliver it to the needy with the help of volunteers and NGOs."
    },
    {
        question: "About NGO?",
        answer: "Our partnered NGOs are verified and work on-ground to distribute food to underprivileged communities."
    },
    {
        question: "How Can I Help?",
        answer: "You can donate surplus food, volunteer for deliveries, or spread awareness."
    },
    {
        question: "How Can I Donate?",
        answer: "Just sign up as a donor, list your surplus food, and schedule a pickup. We'll handle the rest!"
    },
    {
        question: "Do you have any rules?",
        answer: "Yes. We ensure food safety and quality. Expired or spoiled food is not accepted."
    },
    {
        question: "I have more questions",
        answer: "Please contact us directly or visit our Help section."
    }
];

const AboutUs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <div className="faq-container">
                <h2>Have Questions ?</h2>
                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                <span className="plus">{openIndex === index ? '-' : '+'}</span>
                                <span>{item.question}</span>
                            </div>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
