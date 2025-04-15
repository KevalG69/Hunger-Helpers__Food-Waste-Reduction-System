//images
import p1 from '../../assets/image/p1.jpg'
import p2 from '../../assets/image/p2.jpg'
import p3 from '../../assets/image/p3.jpg'
import p4 from '../../assets/image/p4.png'
import p5 from '../../assets/image/p5.jpg'
import p6 from '../../assets/image/p6.jpg'

//css
import '../../css/Component/ProblemSection.css';

const ProblemSection = () => {

    const cardsData = [
        {
          image: `${p1}`,
          text: 'Hunger kills more people each year than AIDS, malaria and terrorism combined',
        },
        {
          image: `${p2}`,
          text: 'Every 10 seconds, a child dies from hunger',
        },
        {
          image: `${p3}`,
          text: '82% of hungry people live in countries with food surpluses, not food shortages',
        },
        {
          image: `${p4}`,
          text: 'One in every eight people sleeps hungry each night',
        },
        {
          image: `${p5}`,
          text: 'One-third of the food produced around the world is never consumed',
        },
        {
          image: `${p6}`,
          text: '733 million hungry people in the world',
        },
      ];

      
    return (
        <>
            <section className="problem-section" id="problem">
                <h2>The problem</h2>
                <p className="subheading">
                    The challenge is not a lack of food — it is making food consistently available to everyone who needs it.
                </p>

                <div className="problem-cards">
                    {cardsData.map((card, index) => (
                        <div key={index} className="problem-card">
                            <img src={card.image} alt="problem" />
                            <p>{card.text}</p>
                        </div>
                    ))}
                </div>
            </section>

        </>
    )
}


export default ProblemSection;