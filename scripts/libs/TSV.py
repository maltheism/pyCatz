import csv


class Writer:
    def __init__(self, data):
        print('- Writer: init started.')
        print(data)
        with open('file.tsv', newline='') as f:
            f.readline()
            reader = csv.reader(f, delimiter='\t')
            data = list(reader)

        output = []
        myMap = {
            'SiteID': 12,
        }
        for line in data:
            participant_id, age, sex, hand, SiteID = line
            output.append([participant_id, age, sex, hand, myMap['SiteID']])

        with open('participants.tsv', 'w', newline='') as f:
            headers = ['participant_id', 'age', 'sex', 'hand', '']
            writer = csv.writer(f, delimiter='\t')
            writer.writerow(headers)
            writer.writerows(output)
