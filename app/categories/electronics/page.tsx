import { Link } from "lucide-react";

const Electronics = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Electronics</h1>
            <Link href="/categories/electronics/phones">Phones</Link>
            <Link href="/categories/electronics/laptops">Laptops</Link>

        </div>
    )
}
export default Electronics;