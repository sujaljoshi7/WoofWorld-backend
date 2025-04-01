import random
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))  # 6-digit OTP

def send_otp_email(email, otp):
    message = Mail(
        from_email="WoofWorld Auth <work.sujaljoshi@gmail.com>",
        to_emails=email,
        subject="Your OTP Code",
        html_content=f"<p>Your OTP code is: <strong>{otp}</strong></p>"
    )
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
