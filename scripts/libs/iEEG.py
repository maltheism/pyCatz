import os
import mne
from scripts.libs import EDF
from mne_bids import write_raw_bids, BIDSPath


class Converter:
    # file_path: whee file located. bids_directory: where to output.
    def __init__(self, data):
        print(type(data))
        print(data['file_path'])
        # json_object = json.loads(data)  # file_path, bids_directory, read_only
        print('- Converter: init started.')
        self.to_bids(
            file=data['file_path'],
            bids_directory=data['bids_directory'],
            read_only=data['read_only']
        )

    @staticmethod
    def validate(path):
        if os.path.isfile(path):
            return True
        else:
            print('File not found or is not file: %s', path)
            return False

    def to_bids(self, file, bids_directory, task='test', ch_type='seeg', read_only=False):
        if self.validate(file):
            reader = EDF.EDFReader(fname=file)
            m_info, c_info = reader.open(fname=file)
            print(m_info)
            print(c_info)
            if read_only:
                return True
            raw = mne.io.read_raw_edf(file)
            if read_only:
                return True
            raw.set_channel_types({ch: ch_type for ch in raw.ch_names})
            bids_root = bids_directory
            subject = m_info['subject_id'].replace('_', '').replace('-', '').replace(' ', '')
            bids_basename = BIDSPath(subject=subject, task=task, root=bids_root, acquisition="seeg")
            raw.info['line_freq'] = 60  # change when known.
            write_raw_bids(raw, bids_basename, overwrite=False)
        else:
            print('File not found or is not file: %s', file)
