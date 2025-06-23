import Link from "next/link"

interface Props {
    items: {
        name: string,
        href: string,
    }[]
}
export default function NavList({ items }: Props) {
  return (
    <div>
        <ul className="flex gap-x-8">
            {items.map((item, index) => (
                <li key={index} className="text-white hover:text-app-secondary transition-colors duration-300">
                    <Link href={item.href}>{item.name}</Link>
                </li>
            ))}
        </ul>
    </div>
  )
}
