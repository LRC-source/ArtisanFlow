with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
"""            } catch (e) {
              console.error(e);
            }""",
"""            } catch (e: any) {
              console.error(e);
              toast.error(e.message || "Account creation failed. You may already have an account.");
            }"""
)

with open(r'c:\Users\lacar\Desktop\ArtisanFlow\components\Auth.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Google Auth catches")
