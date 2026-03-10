import re

files = [
    'yes-links-ui/src/components/LinkList.tsx',
    'yes-links-ui/src/components/CreateLinkForm.tsx',
    'yes-links-ui/src/app/page.tsx'
]

prefix = 'yes-link-'
variants = ['hover:', 'focus:', 'md:', 'lg:', 'sm:', 'xl:', '2xl:', 'dark:', 'group-hover:', 'peer:', 'file:', 'placeholder:', 'focus-visible:', 'disabled:']

def check_file(file_path):
    with open(file_path) as f:
        content = f.read()
    
    # Find all className content
    class_names = re.findall(r'className="([^"]*)"', content)
    
    missing = []
    for cn in class_names:
        classes = cn.split()
        for c in classes:
            # Check if it has a variant
            base_c = c
            for v in variants:
                if c.startswith(v):
                    base_c = c[len(v):]
                    break
            
            if not base_c.startswith(prefix):
                missing.append((cn, c))
    
    return missing

for f in files:
    missing = check_file(f)
    if missing:
        print(f"File: {f}")
        for cn, c in missing:
            print(f"  Missing prefix in '{cn}': '{c}'")
    else:
        print(f"File: {f} is all good.")
