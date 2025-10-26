import { supabase } from '../config/supabase';

export const lecturerService = {
  async createFolder(name, description = '') {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('folders')
      .insert({ name, description, lecturer_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getFolders() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('lecturer_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadDocument(folderId, file, title) {
    const { data: { user } } = await supabase.auth.getUser();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('documents')
      .insert({
        title,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: file.type,
        folder_id: folderId,
        lecturer_id: user.id
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getDocuments(folderId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createQuiz(folderId, title, questions) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        title,
        description: '',
        passing_score: 70,
        folder_id: folderId
      })
      .select()
      .single();
    if (error) throw error;

    const questionInserts = questions.map((q, idx) => ({
      quiz_id: data.id,
      question: q.question,
      options: q.options,
      correct_answer: q.options[q.correctAnswer],
      order_index: idx
    }));

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(questionInserts);
    if (qError) throw qError;
    return data;
  },

  async getQuizzes(folderId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, quiz_questions(*)')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Quiz fetch error:', error);
      return [];
    }
    return data;
  },

  async deleteFolder(folderId) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);
    if (error) throw error;
  },

  async deleteDocument(documentId) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    if (error) throw error;
  },

  async deleteQuiz(quizId) {
    await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
    if (error) throw error;
  }
};
