export default function StepCard({ step }: any) {
    return (
        <div>
            <h4>{step.name}</h4>
            <span>{step.status}</span>
            {step.error && <pre>{step.error}</pre>}
        </div>
    );
}