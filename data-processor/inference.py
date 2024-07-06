#inference will call model pickle file
def process_content(file):
    print(f"Bucket: {file['bucket']}")
    print(f"File: {file['name']}")
    print(f"Metageneration: {file['metageneration']}")
    print(f"Created: {file['timeCreated']}")
    print(f"Updated: {file['updated']}")
    
    return "successful"
