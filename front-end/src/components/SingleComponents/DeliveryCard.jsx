import '../../css/Component/DonationCard.css'

const DeliveryCard = ({ delivery }) => {
    return (
      <div className="donation-card">
        <h4>{delivery.donation_id}</h4>
        <p><strong>Date:</strong> {delivery.type}</p>
        <p><strong>Quantity:</strong> {delivery.status}</p>
        <p><strong>Status:</strong> {delivery.createdAt}</p>
      </div>
    );
  };
  
  export default DeliveryCard;
  