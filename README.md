# NsuCore - Universal Profile Engine

### Project Overview
The **Universal Profile Engine** is a SaaS platform designed for CSE226. It allows users to sign up and configure a personal digital presence hosted at a unique URL.

### Technical Architecture (SELISE Blocks)
This project uses a "Frontend-First" orchestration approach with no custom backend:
* **Identity Management:** Powered by **Selise IAM Block** for secure onboarding and MFA.
* **Data Persistence:** User bios and social links are stored in the **Selise Content Block**.
* **Asset Management:** Profile imagery is handled via the **Selise Media Block**.

### Core Features
* **Secure Login:** Multi-factor authentication integrated.
* **Creator Dashboard:** Interface to update professional headlines, bios, and profile photos.
* **Public Rendering:** Dynamic fetching of user data for public-facing profile pages.

### Setup & Installation
1. Clone the repository: `git clone https://github.com/your-username/NsuCore.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `python app.py`
