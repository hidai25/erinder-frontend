import FamilyMember from './FamilyMember';

export default function DraggableList({ members }) {
    return (
        <ul>
            {members.map((member, index) => (
                <FamilyMember key={index} member={member} />
            ))}
        </ul>
    );
}