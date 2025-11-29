import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("red");

    const formatMessage = (msg: any) => {
        if (Array.isArray(msg)) {
            return msg.map((m) => m.msg || JSON.stringify(m)).join(", ");
        } else if (typeof msg === "object") {
            return msg.detail || JSON.stringify(msg);
        } else {
            return msg;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://172.17.17.10:8000/accounts/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            // Introducing data types to TypeScript
            let data: any;
            try {
                data = await response.json();
            } catch {
                data = null;
            }
            if (!response.ok) {
                setMessageColor("red");
                setMessage(formatMessage(data));
            } else {
                setMessageColor("green");
                setMessage("Logged in successfully!");

                // ⭐ SAVE TOKEN HERE ⭐
                localStorage.setItem("theToken", data.access_token);


                setUsername("");
                setPassword("");
            }
        


        } catch (err) {
            console.error("Network error:", err);
            setMessageColor("red");
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "300px",
                margin: "2rem auto",
            }}
        >
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
            {message && (
                <Label className={messageColor === "red" ? "text-red-500" : "text-green-500"}>
                    {formatMessage(message)}
                </Label>

            )}
        </form>

    );
}

export default Login;
