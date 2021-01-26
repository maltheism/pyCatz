import EDF
import argparse
import os
import logging
import sys
import mne
from mne_bids import write_raw_bids, BIDSPath, read_raw_bids


def validate(path):
    if os.path.isfile(path):
        return True
    else:
        print('File not found or is not file: %s', path)
        sys.exit(1)


def to_BIDS(file, bids_directory, task='test', ch_type='seeg', read_only=False):
    if validate(file):
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
        logger.debug('File not found or is not file: %s', file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', '--file', help='file path', nargs=1, type=str, required=True)
    parser.add_argument('--debug', help='Enable debug logging.', default=False, required=False, action='store_const',
                        const=True)
    parser.add_argument('-r', '--read', help='Read EDF without creating BIDS', default=False, required=False,
                        action='store_const', const=True)
    parser.add_argument('-d', '--directory', help='BIDS directory for file insertion', nargs=1, type=str, required=True)
    args = parser.parse_args()
    if args.debug:
        logging.basicConfig(level=logging.DEBUG)
        logger = logging.getLogger('pyedf_logger')
        handler = logging.FileHandler('debug.log')
        formatter = logging.Formatter('[%(asctime)s][%(levelname)s]: %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.debug('Debug on')
        logger.debug('shell arguments: %s', args)
    to_BIDS(file=args.file[0], bids_directory=args.directory[0], read_only=args.read)
