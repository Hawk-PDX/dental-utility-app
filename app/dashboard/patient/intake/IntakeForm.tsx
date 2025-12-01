/**

The form will:
1. Be rendered at /dashboard/patient/intake 
2. Submit data to the intake_forms table in Supabase
3. Be viewable by doctors who have an active link to that patient (via RLS policies and the doctor_patient_links table)
 
 */

const IntakeForm = async () => {

    return (
        <>
            <header className="intake-header">
                <img src="/logos/practices/ws_endo_logo.svg" alt="Doctor's Logo" className="doctor-logo" />
                <h1>Patient Intake Form</h1>
            </header>
            <div className="intake-form">
                <form
                >

                </form>
            </div>
        </>
            
    )
}

export default IntakeForm