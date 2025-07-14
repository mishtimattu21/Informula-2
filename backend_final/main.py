from supabase_client import get_user_profile
from prompt_formatter import format_prompt
from gemini_client import get_ingredient_report
from processing import INGREDIENTS_TEXT

def main():
    # Sample user ID — must match one from your Supabase table
    user_id = input("Enter user UUID: ").strip()
    
    # Step 1: Get user profile
    user_profile = get_user_profile(user_id)
    if not user_profile:
        print("❌ User not found.")
        return

    # Step 2: Use extracted text from image
    ingredients_input = INGREDIENTS_TEXT

    # Step 3: Format prompt
    prompt = format_prompt(ingredients_input, user_profile)

    # Step 4: Get Gemini response
    print("\n🔄 Generating your safety analysis...\n")
    result = get_ingredient_report(prompt)
    print("✅ Result:\n")
    print(result)

if __name__ == "__main__":
    main()
