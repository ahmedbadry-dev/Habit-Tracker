
import ResetPasswordForm from "@/components/web/auth/ResetPasswordForm";
import { redirect } from "next/navigation";

type ResetPasswordPageProps = {
    searchParams: Promise<{
        token?: string
        error?: string
    }>
}
export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {

    const params = await searchParams

    const token = params.token ?? ""
    const error = params.error

    if (!params.token) {
        redirect("/auth/forgot-password")
    }


    return <ResetPasswordForm token={token} error={error} />
}