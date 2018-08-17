class BColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_ok(obj):
    print(BColors.OKGREEN)

    if hasattr(obj, '__call__'):
        obj()
    else:
        print(obj)

    print(BColors.ENDC)


def print_fail(obj):
    print(BColors.FAIL)
    if hasattr(obj, '__call__'):
        obj()
    else:
        print(obj)

    print(BColors.ENDC)