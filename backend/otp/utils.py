import random
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# from django.conf import settings

from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def generate_otp():
    return str(random.randint(100000, 999999))  # 6-digit OTP

# def send_otp_email(email, otp):
#     message = Mail(
#         from_email="WoofWorld Auth <work.sujaljoshi@gmail.com>",
#         to_emails=email,
#         subject="Your OTP Code",
#         html_content=f"<p>Your OTP code is: <strong>{otp}</strong></p>"
#     )
#     try:
#         sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
#         response = sg.send(message)
#         return response.status_code == 202
#     except Exception as e:
#         print(f"Error sending email: {e}")
#         return False

def get_otp_email_template(otp):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
                background-color: #ffc107;
            }}
            .content {{
                padding: 30px 20px;
                background-color: white;
                border-radius: 5px;
                margin: 20px 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }}
            .otp-box {{
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                text-align: center;
                margin: 20px 0;
                font-size: 24px;
                letter-spacing: 5px;
                font-weight: bold;
                color: #333;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
            .button {{
                display: inline-block;
                padding: 10px 20px;
                background-color: #ffc107;
                color: #000;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: #000; margin: 0;">WoofWorld</h1>
            </div>
            <div class="content">
                <h2>Your OTP for Registration</h2>
                <p>Hello! Thank you for registering with WoofWorld. To complete your registration, please use the following OTP:</p>
                
                <div class="otp-box">
                    {otp}
                </div>
                
                <p>This OTP will expire in 5 minutes for security reasons.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
                
                <div style="text-align: center;">
                    <a href="https://woofworld.com" class="button">Visit WoofWorld</a>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; 2024 WoofWorld. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

def send_email_to_client(email, otp):
    try:
        subject = "Your WoofWorld Registration OTP"
        html_message = get_otp_email_template(otp)
        from_email = f"WoofWorld <{settings.EMAIL_HOST_USER}>"
        recipient_list = [email]
        
        logger.info(f"Attempting to send OTP email to {email}")
        
        send_mail(
            subject=subject,
            message=f"Your OTP is: {otp}",  # Plain text fallback
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,  # HTML version
            fail_silently=False
        )
        
        logger.info(f"OTP email sent successfully to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        return False