import csv


class Writer:
    def __init__(self, data):
        print('- Writer: init started.')
        # print(data)
        file_path = data['bids_directory'] + '/participants.tsv'
        with open(file_path, newline='') as f:
            f.readline()
            reader = csv.reader(f, delimiter='\t')
            rows = list(reader)

        output = []
        for line in rows:
            participant_id, age, sex, hand = line
            output.append([participant_id, age, sex, hand, data['site_id']])

        with open(file_path, 'w', newline='') as f:
            headers = ['participant_id', 'age', 'sex', 'hand', 'siteID']
            writer = csv.writer(f, delimiter='\t')
            writer.writerow(headers)
            writer.writerows(output)
