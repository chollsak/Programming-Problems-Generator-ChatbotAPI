import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("KEY")

def chat_with_gpt(prompt):
    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = [
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message["content"]

if __name__ == "__main__":
    while True:
        print("-----------------------------")
        level = input("Enter the level of the problems (easy, medium, hard, more or quit: ")
        print("-----------------------------")

        prompt = "Give me a the leetcode problems of " + level + " level and give me the example test cases and example output and example source code"
        
        if level.lower() in ["quit", "exit", "stop", "bye"]:
            break

        response = chat_with_gpt(prompt)
        print(f"AI: {response}")