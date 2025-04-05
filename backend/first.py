import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate('D:\IMP\HackKU Project\Service_account_file.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def cls():
    import os
    os.system('cls')

cls()

def store_item(item_name, item_location):
    
    doc_ref = db.collection('item').document('Location & Names')

    doc_ref.set({
        'name': item_name,
        'location' : item_location
    })

    print(f"Item '{item_name}' has been stored successfully!")

def retrieve_item(item_name):

    doc_ref = db.collection('item').document('Location & Names')
    
    doc = doc_ref.get()

    if doc.exists:

        print(f"Item '{item_name}' is stored at {doc.to_dict()['location']}.")
    
    else:

        print(f"Item '{item_name}' not found.")

def main():
    while True:
        
        print("\nWelcome to the Item Locator!")
        print("1. Store an item")
        print("2. Retrieve an item")
        print("3. Exit")
        
        choice = input("Choose an option: ")

        if choice == "1":
            cls()
            item_name = input("Enter the name of the item: ")
            item_location = input("Enter the location of the item: ")
            store_item(item_name, item_location)
        elif choice == "2":
            cls()
            item_name = input("Enter the name of the item to search: ")
            retrieve_item(item_name)
        elif choice == "3":
            print("Closing the app!")
            break
        else:
            print("Invalid choice. Please try again.")

# Run the program
if __name__ == "__main__":
    main()