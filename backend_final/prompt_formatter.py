import re


def parse_ingredient_list(text: str) -> list[str]:
    if not text or not text.strip():
        return []
    cleaned = re.sub(r"\s+", " ", text.strip())
    parts = re.split(r"[,;\n]+", cleaned)
    return [p.strip() for p in parts if p.strip()]


def format_prompt(ingredients_input, user_profile, product_type='', product_name=''):
    allergies = ', '.join(user_profile.get('allergies') or []) or 'none'
    avoid = ', '.join(user_profile.get('avoid_list') or []) or 'none'
    meds = ', '.join(user_profile.get('past_medication') or []) or 'none'
    ingredient_items = parse_ingredient_list(ingredients_input)
    ingredient_count = len(ingredient_items) if ingredient_items else max(
        1, ingredients_input.count(",") + 1
    )

    return f"""Expert ingredient safety analyst. Return ONLY one JSON object (no markdown).

SCHEMA: {{"overallScore":number,"riskLevel":"Low"|"Medium"|"High","totalIngredients":number,"flaggedIngredients":number,"insights":[{{"ingredient":str,"risk":"safe"|"medium"|"high","description":str,"source":str,"sources":[str]}}],"initialAnalysis":str,"recommendations":[str]}}

CRITICAL: There are {ingredient_count} ingredients below. Return exactly {ingredient_count} insights — one per ingredient, same order. Never omit safe ingredients. totalIngredients must be {ingredient_count}. insights.length must equal {ingredient_count}.

For EACH insight:
- Cite FDA, EWG, PubChem, or CIR in "source"; add one URL/DOI in "sources" when known.
- If risk is "safe": description = 1 short sentence. Otherwise: 2 sentences (what it is + user-relevant safety note).
- If banned/restricted in US, EU, Canada, UK, Australia, or Japan: include <span style="color: red;">BANNED in [countries]</span> (exact countries only).

User: age {user_profile['age']}, gender {user_profile['gender']}, diet {user_profile.get('diet_type', 'unknown')}, allergies {allergies}, avoid {avoid}, meds {meds}.
Diet rules: vegetarian=flag animal/meat/fish; vegan=flag all animal-derived; non-vegetarian=no diet flags unless allergy-related.
Product: {product_name or 'Not specified'} | Type: {product_type or 'Not specified'}
Ingredients:
{ingredients_input.strip()}

flaggedIngredients = non-safe or allergy/avoid matches. initialAnalysis: 2-3 sentences. recommendations: 3 items, 8-10 words each.
Return ONLY JSON."""
