import StepCard from './StepCard';


export default function StepTimeline({ steps }: { steps: any[] }) {
    return (
        <div>
            {steps.map((s) => (
            <StepCard key={s.name} step={s} />
            ))}
        </div>
    );
}