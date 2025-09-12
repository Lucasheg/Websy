export default function selectPlan({ openModal }, { plan }) {
  openModal({
    id: 'select-plan',
    title: `Selected: ${plan}`,
    content: <div className="ts-h6" style={{marginTop:8}}>We’ll include this in your brief.</div>,
  });
}
