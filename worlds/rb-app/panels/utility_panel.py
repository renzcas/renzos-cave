
import tkinter as tk
from tkinter import ttk, scrolledtext
from utilities.file_organizer import organize_folder
from utilities.duplicate_finder import find_duplicates
from utilities.smart_renamer import rename_files
from utilities.folder_cleaner import clean_folder

class UtilityPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="Utility Panel")

        self.folder_var = tk.StringVar()

        tk.Label(frame, text="Folder:").pack()
        tk.Entry(frame, textvariable=self.folder_var, width=60).pack()

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="Organize Files",
                  command=lambda: organize_folder(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Find Duplicates",
                  command=lambda: find_duplicates(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Rename Files",
                  command=lambda: rename_files(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Clean Folder",
                  command=lambda: clean_folder(self.folder_var.get(), self.log)).pack()
