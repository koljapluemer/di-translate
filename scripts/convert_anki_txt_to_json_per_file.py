import os
import json
import re
from bs4 import BeautifulSoup


ANKI_FOLDER = '/home/b/GITHUB/arz-conjugation/src/data/anki'
OUT_FILE = '/home/b/GITHUB/arz-conjugation/src/data/data.json'

def main():
    # loop .txt files in folder
    word_objects = {}
    for file in os.listdir(ANKI_FOLDER):
        if file.endswith('.txt'):
            with open(os.path.join(ANKI_FOLDER, file) )as f:
                word = file.split('.')[0]
                word_objects[word] = {
                    'tenses': {}
                }
                in_file = f.read()
                split_by_empty_line = re.split(r'^\s*"\s*$', in_file, flags=re.MULTILINE)

                for form in split_by_empty_line:

                    person = re.compile(r'Person: [a-z0-9]+')
                    match = person.search(form)
                    if match:
                        """"""
                        person = match.group(0).split(': ')[1]
                    else:
                        print('no match!!', form)
                        continue

                    # find stuff like 'Tense: perfect'
                    re_tense = re.compile(r'Tense: [a-z]+')
                    match = re_tense.search(form)
                    if match:
                        tense = match.group(0).split(': ')[1]
                    else:
                        print('no tense match!!', form)
                        continue

                    # find stuff like sound:eavcd001-007.mp3
                    sound = re.compile(r'sound:[a-z0-9-]+.mp3')
                    match = sound.search(form)
                    if match:
                        sound = match.group(0).split(':')[1]
                    else:
                        print('no sound match!!', form)
                        continue

                    # interpret word string as html
                    soup = BeautifulSoup(form, 'html.parser')
                    # find div.arabic
                    arabic = soup.find('div', class_='arabic')
                    pronunciation = soup.find('div', class_='pronunciation')
                    english = soup.find('div', class_='english')

                   

                    # make a tenses prop if it doesn't exist for the CURRENTLY FOUND tense
                    print('TENSE', tense)
                    if tense not in word_objects[word]['tenses'].keys():
                        word_objects[word]['tenses'][tense] = {}

                    if arabic and pronunciation and english:
                        if "n't" in english.text:
                            person+='!'

                        word_objects[word]['tenses'][tense][person] = {
                            'arabic': arabic.text,
                            'pronunciation': pronunciation.text,
                            'english': english.text,
                            'sound': sound,
                        }
                    else:
                        print('missing some of the divs!!', form)
                        continue


    with open(OUT_FILE, 'w') as f:
        json.dump(word_objects, f)

if __name__ == '__main__':
    main()