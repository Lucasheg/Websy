// Opens a modal (or scheduling embed later)
export default function bookCall({ openModal }) {
  openModal({
    id: 'book-call',
    title: 'Book a call',
    content: (
      <div className="ts-h6" style={{marginTop:8}}>
        Pick a time and we’ll confirm by email.
        {/* Later: embed Calendly/Cal.com here */}
      </div>
    ),
  });
}
