import { redirect } from "next/navigation";
export default function Kambaz() {
    redirect("/Account/Signin");
    return (
        <div id="wd-kambaz">
            <h1>Kambaz</h1>
        </div>
    );
}

