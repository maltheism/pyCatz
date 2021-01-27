import sys
import json
import mne
import os
import subprocess


if __name__ == '__main__':
    fname = os.path.dirname(os.path.realpath(__file__)) + "/example/example.gz"

    raw = mne.io.read_raw_fif(fname)

    rawX = raw.get_data()

    # print(type(rawX))
    # print(rawX.size)
    # print(rawX.tolist())
    # print(rawX)

    python_path = subprocess.check_output("which python", shell=True).strip()
    python_path = python_path.decode('utf-8')

    # single thead approach
    json_dump = json.dumps({
        'type': 'FIRE_ONCE_RESULT',
        'result': str(rawX),
        # 'result': python_path,
    })

    # Flushing stdout is needed
    print(json_dump)
    sys.stdout.flush()
