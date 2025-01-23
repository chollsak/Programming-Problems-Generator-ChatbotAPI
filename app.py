import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("KEY")

def chat_with_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message["content"]

if __name__ == "__main__":
    print("Welcome to the Programming Problem Generator!")
    
    print("Choose your language (type 'en' for English, 'th' for Thai):")
    lang = input().strip().lower()

    if lang not in ["en", "th"]:
        print("Invalid language selection. Defaulting to English.")
        lang = "en"

    while True:
        print("-----------------------------")
        level = input("Enter the level of the problems (easy, medium, hard): ")
        print("-----------------------------")

        if lang == "th":
            prompt = f"ขอโจทย์ LeetCode ระดับ {level} อธิบายคำอธิบายของปัญหา ตัวอย่างTestcase 3 ชุด ผลลัพธ์ตัวอย่าง 3 ชุด ชื่อโจทย์ และตัวอย่างโค้ดโปรแกรม"
        else:
            prompt = f"Give me a {level} level LeetCode problems. Provide problem descriptions, 3 example test cases, 3 example output, name of the problem, and example source code."

        while True:
            response = chat_with_gpt(prompt)

            if lang == "th":
                print(f"AI (Thai): {response}")
            else:
                print(f"AI (English): {response}")

            print("-----------------------------")
            print("Do you want to ask for another problem of the same difficulty? (more/no)")
            answer = input()

            if answer.lower() == "no":
                break
            elif answer.lower() == "more":
                if lang == "th":
                    prompt = f"ขอโจทย์ LeetCode ระดับ {level} อีก 1 โจทย์ อธิบายคำอธิบายของปัญหา ตัวอย่างTestcase 3 ชุด ผลลัพธ์ตัวอย่าง 3 ชุด ชื่อโจทย์ และตัวอย่างโค้ดโปรแกรม"
                else:
                    prompt = f"Give me another {level} level LeetCode problem. Provide problem description, 3 example test cases, 3 example output, name of the problem, and example source code."
                print("-----------------------------")
            else:
                print("Invalid input. Assuming 'more'.")
        
        print("-----------------------------")
        print("Do you want to generate problems of a different difficulty level? (yes/no)")
        new_question = input()
        if new_question.lower() == "no":
            print("Goodbye!")
            break
        
        print("-----------------------------")


