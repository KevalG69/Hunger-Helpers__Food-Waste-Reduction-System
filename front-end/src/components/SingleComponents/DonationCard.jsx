import '../../css/Component/DonationCard.css'

const DonationCard = ({ donation }) => {
    return (
      <div className="donation-card">
        <h4>{donation.food_name}</h4>
        <p><strong>Date:</strong> {donation.createdAt}</p>
        <p><strong>Quantity:</strong> {donation.food_quantity}</p>
        <p><strong>Status:</strong> {donation.status}</p>
      </div>
    );
  };
  
  export default DonationCard;
  