function Booking() {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-red-600 mb-4">📅 Book a Counselor</h2>
      <form className="bg-white shadow-lg rounded-lg p-6 space-y-4 w-full max-w-md">
        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-md" />
        <input type="email" placeholder="Your Email" className="w-full p-2 border rounded-md" />
        <input type="date" className="w-full p-2 border rounded-md" />
        <textarea placeholder="Reason (optional)" className="w-full p-2 border rounded-md"></textarea>
        <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
          Book Appointment
        </button>
      </form>
    </div>
  );
}
export default Booking;
