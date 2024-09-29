import { useDrag } from 'react-dnd';

export default function FamilyMember({ member }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'familyMember',
        item: { id: member.id, name: member.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <li
            ref={drag}
            className={`flex items-center space-x-4 mb-2 p-2 rounded cursor-move ${
                isDragging ? 'opacity-50' : 'opacity-100'
            }`}
        >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
            </div>
            <span>{member.name}</span>
        </li>
    );
}